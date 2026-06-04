import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";
import { Rate, Counter } from "k6/metrics";

// Anggap 201 & 409 valid
http.setResponseCallback(http.expectedStatuses(201, 409));
// Load users
const users = new SharedArray("tokens", function () {
  return JSON.parse(open("./tokens-200.json")).filter((u) => u.token);
});

// Custom metrics
const bookingSuccess = new Rate("booking_business_success");
const status201 = new Counter("booking_success_201");
const status409 = new Counter("booking_conflict_409");
const otherStatus = new Counter("booking_other_status");
// CONFIG
export const options = {
  // VUS DIGANTI SESUAI TAHAP
  vus: 500,
  duration: "1m",
  discardResponseBodies: true,
  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)"],
  thresholds: {
    checks: ["rate>0.95"],
    http_req_duration: ["p(95)<1500"],
    booking_business_success: ["rate>0.95"],
  },
};

// MAIN TEST
export default function () {
  // Rotasi user
  const user = users[(__ITER + __VU) % users.length];
  // Rotasi jadwal
  const scheduleId = ((__ITER + __VU) % 4) + 1;
  const res = http.post(
    "http://localhost:5000/api/bookings",
    JSON.stringify({
      schedule_id: scheduleId,
      catatan: `Stress test by ${user.email}`,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    },
  );

  // Business logic valid
  const ok = res.status === 201 || res.status === 409;
  bookingSuccess.add(ok);

  // Counter
  if (res.status === 201) {
    status201.add(1);
  } else if (res.status === 409) {
    status409.add(1);
  } else {
    otherStatus.add(1);

    console.log(`Unexpected status=${res.status}`);
  }

  // Validation
  check(res, {
    "status is 201 or 409": (r) => r.status === 201 || r.status === 409,
    "response time < 1500ms": (r) => r.timings.duration < 1500,
  });

  // Delay request
  sleep(0.3);
}
