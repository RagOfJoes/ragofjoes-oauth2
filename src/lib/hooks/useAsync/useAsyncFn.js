import useMountedState from '../useMountedState';
import { useCallback, useState, useRef } from 'react';

export default function useAsyncFn(fn, deps, initialState = { loading: false }) {
	const lastCallId = useRef(0);
	const [state, set] = useState(initialState);

	const isMounted = useMountedState();

	const callback = useCallback((...args) => {
		const callId = ++lastCallId.current;
		set({ loading: true });

		return fn(...args).then(
			(value) => {
				isMounted() &&
					callId === lastCallId.current &&
					set({ value, loading: false });

				return value;
			},
			(error) => {
				isMounted() &&
					callId === lastCallId.current &&
					set({ error, loading: false });

				return error;
			}
		);
	}, deps);

	return [state, callback];
}
