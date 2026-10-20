import { createFileRoute } from '@tanstack/react-router';
import { OrderPage } from '../index';

export const Route = createFileRoute('/_tabs/orders/')({
  component: OrderPage,
});