import { ThemeProvider } from 'theme-ui';
import theme from './theme';

interface ThemeInterface {
	Component: any
	props: any
}

function Theme({ Component, props }: ThemeInterface) {
	return <>
		<ThemeProvider theme={theme}>
			<Component {...props} />
		</ThemeProvider>
	</>;
}

export default Theme;
