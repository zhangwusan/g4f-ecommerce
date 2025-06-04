import { KHQRService } from '@/app/common/services/khqr.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class PAYKHQRService {
    private readonly _service: KHQRService;

    constructor() {
        this._service = new KHQRService;
    }

    async check_payment_transaction_md5(md5: string) {
        return await this._service.check_with_md5(md5);
    }

    async check_payment_transaction_hash(hash: string) {
        return await this._service.check_with_hash(hash);
    }

    async check_payment(type: 'md5' | 'hash', value: string) {
        return await this._service.check(type, value);
    }

    async check_list_payment(type: 'md5' | 'hash', values: string[]) {
        return await this._service.check_list(type, values)
    }

    async generate_khqr(amount: number) {
        return await this._service.generate(amount);
    }
}