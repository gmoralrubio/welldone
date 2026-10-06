import { Link } from '@heroui/react';
import { Pencil } from '@gravity-ui/icons';

const WriteButton = () => {
  return (
    <Link
      href="/articles/create"
      className="inline-flex items-center gap-1.5 rounded bg-accent-soft px-3 py-1.5 text-sm font-semibold text-accent-soft-foreground no-underline"
    >
      <Pencil
        width={15}
        height={15}
      />
      Escribir
    </Link>
  );
};

export default WriteButton;
