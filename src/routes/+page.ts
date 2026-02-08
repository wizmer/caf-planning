import { redirect } from '@sveltejs/kit';
import { routes } from './routes';

export function load() {
	redirect(308, routes.planning);
}
