export interface otakuApiResult {
	url: string;
}

export type Status<T> =
	| {
			status: 'success';
			message?: string;
			data?: T;
	  }
	| {
			status: 'error';
			message: string;
	  };
