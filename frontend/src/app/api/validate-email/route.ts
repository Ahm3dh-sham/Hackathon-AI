import { NextRequest, NextResponse } from "next/server";
import dns from "dns";

const resolveMx = dns.promises.resolveMx;

const BLOCKED_DOMAINS = new Set([
  "example.com",
  "example.org",
  "example.net",
  "test.com",
  "testing.com",
  "abc.com",
  "xyz.com",
  "asdf.com",
  "qwerty.com",
  "qwer.com",
  "fake.com",
  "fakemail.com",
  "invalid.com",
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "trashmail.com",
  "sharklasers.com",
  "getnada.com",
  "maildrop.cc",
  "gmil.com",
  "gmal.com",
  "gmial.com",
  "gamil.com",
  "gmail.co",
  "gmail.con",
  "gmail.org",
  "gmail.net",
  "yaho.com",
  "yahooo.com",
  "yahoo.co",
  "outlok.com",
  "hotmal.com",
  "iclod.com",
]);

const BLOCKED_LOCAL_PARTS = new Set([
  "test",
  "testing",
  "abc",
  "abcd",
  "asdf",
  "qwerty",
  "qwer",
  "user",
  "admin",
  "fake",
  "demo",
  "example",
  "sample",
  "none",
  "null",
  "undefined",
  "xyz",
  "aaa",
  "bbb",
  "ccc",
  "123",
  "1234",
  "12345",
  "123456",
]);

const StrictEmailRegex =
  /^[a-zA-Z0-9]+([._+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(\.[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)*\.[a-zA-Z]{2,10}$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawEmail = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!rawEmail || !StrictEmailRegex.test(rawEmail)) {
      return NextResponse.json(
        { valid: false, message: "enter valid mail id" },
        { status: 200 }
      );
    }

    const [localPart, domainPart] = rawEmail.split("@");
    if (!localPart || !domainPart) {
      return NextResponse.json(
        { valid: false, message: "enter valid mail id" },
        { status: 200 }
      );
    }

    // Local part must be at least 3 chars, contain at least one letter, and not be a dummy word
    if (
      localPart.length < 3 ||
      !/[a-zA-Z]/.test(localPart) ||
      BLOCKED_LOCAL_PARTS.has(localPart)
    ) {
      return NextResponse.json(
        { valid: false, message: "enter valid mail id" },
        { status: 200 }
      );
    }

    // Domain checks
    if (BLOCKED_DOMAINS.has(domainPart)) {
      return NextResponse.json(
        { valid: false, message: "enter valid mail id" },
        { status: 200 }
      );
    }

    const domainLabels = domainPart.split(".");
    const domainName = domainLabels[0];
    const tld = domainLabels[domainLabels.length - 1];

    // Reject single-char domains, purely numeric domains, or invalid TLDs
    if (
      domainName.length < 2 ||
      /^\d+$/.test(domainName) ||
      tld.length < 2 ||
      ["con", "cmo", "comm", "orr", "nett"].includes(tld)
    ) {
      return NextResponse.json(
        { valid: false, message: "enter valid mail id" },
        { status: 200 }
      );
    }

    // Verify real DNS MX records so fake/non-existent domains are rejected
    try {
      const mxRecords = await resolveMx(domainPart);
      if (!mxRecords || mxRecords.length === 0) {
        return NextResponse.json(
          { valid: false, message: "enter valid mail id" },
          { status: 200 }
        );
      }
      // Check that at least one MX exchange host is non-empty
      const hasValidExchange = mxRecords.some(
        (record) => record.exchange && record.exchange.trim().length > 0 && record.exchange !== "."
      );
      if (!hasValidExchange) {
        return NextResponse.json(
          { valid: false, message: "enter valid mail id" },
          { status: 200 }
        );
      }
    } catch {
      // Domain does not exist or has no MX records
      return NextResponse.json(
        { valid: false, message: "enter valid mail id" },
        { status: 200 }
      );
    }

    return NextResponse.json({ valid: true, email: rawEmail }, { status: 200 });
  } catch {
    return NextResponse.json(
      { valid: false, message: "enter valid mail id" },
      { status: 200 }
    );
  }
}
