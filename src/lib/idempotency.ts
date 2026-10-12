export class SubmissionIdentity {
  private payload: string | null = null;
  private key: string | null = null;
  forPayload(value: unknown): string {
    const payload = JSON.stringify(value);
    if (payload !== this.payload || !this.key) {
      this.payload = payload;
      this.key = crypto.randomUUID();
    }
    return this.key;
  }
  complete(): void {
    this.payload = null;
    this.key = null;
  }
}
