import { StatusCode } from './enum';

export type Status<T = undefined> =
	| {
			status: StatusCode.SUCCESS;
			message?: string | undefined;
			data?: T;
	  }
	| {
			status: StatusCode.ERROR | StatusCode.NOT_FOUND;
			message: string;
	  };
