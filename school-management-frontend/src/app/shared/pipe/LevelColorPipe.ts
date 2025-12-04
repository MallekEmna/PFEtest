import { Pipe, PipeTransform } from '@angular/core';
import { Level } from '../../models/Level';

@Pipe({
  name: 'levelColor',
  standalone: true
})
export class LevelColorPipe implements PipeTransform {

  transform(level: Level): string {
    switch (level) {
      case Level.PRIMARY:
        return 'bg-green-100 text-green-800 border-green-200';
      case Level.MIDDLE:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case Level.HIGH:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

}
