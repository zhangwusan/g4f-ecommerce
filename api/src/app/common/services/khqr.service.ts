import { BakongKHQR, IndividualInfo, MerchantInfo, SourceInfo, KHQRResponse, khqrData } from 'bakong-khqr';
import axios from 'axios';
import { EncodedService } from './encode.service';
import * as QRCode from 'qrcode';

export class KHQRService {
    private readonly token: string;
    private readonly bakong_account_id: string;
    private readonly acquiring_bank_name: string;
    private readonly merchant_city: string;
    private readonly merchant_name: string;
    private khqr_string: string;
    private readonly khqr;

    constructor() {
        this.token = process.env.HKQR_TOKEN_DEV;
        this.bakong_account_id = process.env.BAKONG_ACCOUNT_ID;
        this.acquiring_bank_name = process.env.ACQUIRING_BANK;
        this.merchant_city = process.env.MERCHANT_CITY;
        this.merchant_name = process.env.MERCHANT_NAME;
        this.khqr_string = '';
        this.khqr = new BakongKHQR(process.env.HKQR_TOKEN_DEV);
    }


    async generate(amount?: number, khr: boolean = false) {
        const payload = {
            bakongAccountID: this.bakong_account_id,
            acquiringBank: this.acquiring_bank_name,
            merchantName: this.merchant_name,
            merchantCity: this.merchant_city,
            currency: khr ? khqrData.currency.khr : khqrData.currency.usd,
        }
        if (amount) {
            payload['amount'] = amount;
        }
        const individual = this.khqr.generateIndividual(payload);

        const convert_base64 = await QRCode.toDataURL(individual.data.qr);

        const source_info = new SourceInfo({
            appIconUrl: "https://bakong.nbc.gov.kh/images/logo.svg",
            appName: "G4F-Shop",
            appDeepLinkCallback: `${process.env.WEB_BASE_URL}/cart/complete`
        })

        const { data } = await axios.post(`${process.env.API_BASE_BAKONG}/v1/generate_deeplink_by_qr`, {
            qr: individual.data.qr,
            sourceInfo: source_info
        })

        return {
            qr: individual.data.qr,
            link: data.data.shortLink,
            md5: individual.data.md5,
            base64: convert_base64
        }
    }

    async check_with_md5(md5: string) {
        const response = await axios.post(`${process.env.API_BASE_BAKONG}/v1/check_transaction_by_md5`, {
            md5
        }, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });

        return response.data
    }

    async check_with_hash(hash: string) {
        const response = await axios.post(`${process.env.API_BASE_BAKONG}/v1/check_transaction_by_hash`, {
            hash
        }, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });

        return response.data
    }

    async check(type: 'md5' | 'hash', value: string) {
        const endpoint = type === 'md5'
            ? '/v1/check_transaction_by_md5'
            : '/v1/check_transaction_by_hash';

        const payload = type === 'md5'
            ? { md5: value }
            : { hash: value };

        const response = await axios.post(
            `${process.env.API_BASE_BAKONG}${endpoint}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }
        );
        return response.data;
    }

    async check_list(type: 'md5' | 'hash', values: string[]) {
        const endpoint = type === 'md5'
            ? '/v1/check_transaction_by_md5_list'
            : 'v1/check_transaction_by_hash_list';

        const response = await axios.post(
            `${process.env.API_BASE_BAKONG}${endpoint}`,
            values,
            {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }
        );
        return response.data;
    }
}