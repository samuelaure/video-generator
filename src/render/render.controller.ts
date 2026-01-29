import { Controller, Post, Body } from '@nestjs/common';
import { RenderService } from './render.service';

@Controller('render')
export class RenderController {
  constructor(private readonly renderService: RenderService) {}

  @Post()
  async render(@Body() body: { template: string; output: string }) {
    return await this.renderService.generateVideo(body.template, body.output);
  }
}