import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'limitTo'
})

export class LimitToPipe implements PipeTransform {
    transform(value: string, args: string, ellipsis: boolean): string {
        let limit = args ? parseInt(args, 10) : 10; // default limit to 10
        limit = limit > value.length ? value.length : limit; // override to max out at length
        const trail = ellipsis ? '...' : ''; // ellipsis or not
        return value.substring(0, limit) + trail;
    }
}
