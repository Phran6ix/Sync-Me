export default interface IOtp {
  user: string;
  otp: number;
  verified: true;
  purpose: "sign-up" | "reset-password";
}
