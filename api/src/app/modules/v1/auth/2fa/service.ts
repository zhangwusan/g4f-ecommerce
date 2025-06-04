import { Injectable } from "@nestjs/common";

import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable()
export class E2FAService {
  generateSecret(email: string) {
    const secret = speakeasy.generateSecret({
      name: `G4F-Shop (${email})`,
    });

    return {
      otpauthUrl: secret.otpauth_url,
      base32: secret.base32,
    };
  }

  async generateQRCode(otpauthUrl: string): Promise<string> {
    return await qrcode.toDataURL(otpauthUrl);
  }

  verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1, // tolerate +/- 1 step (~30s each)
    });
  }
}