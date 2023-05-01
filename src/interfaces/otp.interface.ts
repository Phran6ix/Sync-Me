export default interface IOtp {
  user: string;
  otp: string;
  verified: true;
  purpose: "sign-up" | "reset-password";
}
