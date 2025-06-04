// image-classification.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class ImageClassificationService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.apiUrl = process.env.AI_IMAGE_CLASSIFIER_URL?.replace(/\/$/, '') || 'http://localhost:10007';
    this.apiKey = process.env.AI_IMAGE_CLASSIFIER_API_KEY || '';
  }

  async classifyImage(image: Express.Multer.File): Promise<string[]> {
    const form = new FormData();
    form.append('image', image.buffer, image.originalname);

    try {
      const response = await axios.post(`${this.apiUrl}/classify`, form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${this.apiKey}`,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      if (!response.data || !Array.isArray(response.data.labels)) {
        throw new Error('Invalid response format from classifier');
      }

      return response.data.labels;
    } catch (error) {
      console.error('AI classification error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to classify image');
    }
  }
}