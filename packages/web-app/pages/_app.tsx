import type { AppProps } from 'next/app';
import Theme from '../themes/default-theme';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Theme
			Component={Component}
			props={pageProps}
		/>
	);
}

export default MyApp;
