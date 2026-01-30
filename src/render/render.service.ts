import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class RenderService {
  async generateVideo(templateName: string, outputName: string) {
    const templatePath = path.join(
      __dirname,
      'templates',
      `${templateName}.json`,
    );
    const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

    const bg = path.resolve('templates', templateName, template.bg);
    const audio = path.resolve('templates', templateName, template.audio);
    const output = path.resolve('outputs', `${outputName}.mp4`);

    const filterComplex = template.texts
      .map((t, i) => {
        const draw = `drawtext=text='${t.content}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=(h-text_h)/2:enable='between(t,${t.start},${t.start + t.duration})'`;
        return `[v${i}]${draw}`;
      })
      .join(',');

    const cmd = `ffmpeg -i ${bg} -i ${audio} -filter_complex "[0:v]${filterComplex}[v];[1:a]anull[a]" -map "[v]" -map "[a]" -shortest ${output}`;

    await execAsync(cmd);

    return { status: 'success', output };
  }
}
