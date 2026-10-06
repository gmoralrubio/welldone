import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// exporta los wrappers en las APIs de navegacion de Next
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
