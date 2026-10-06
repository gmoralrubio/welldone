import { Avatar, Dropdown } from '@heroui/react';
import { ChevronDown } from '@gravity-ui/icons';

const UserProfile = () => {
  return (
    <Dropdown>
      <Dropdown.Trigger
        className="flex items-center gap-1.5 bg-transparent px-1"
        aria-label="Cuenta"
      >
        <Avatar
          size="sm"
          className="size-8"
        >
          <Avatar.Fallback className="text-xs bg-accent-soft text-accent-soft-foreground">
            WD
          </Avatar.Fallback>
        </Avatar>
        <ChevronDown
          width={8}
          height={8}
        />
      </Dropdown.Trigger>

      <Dropdown.Popover>
        <Dropdown.Menu aria-label="Cuenta">
          <Dropdown.Item id="profile">Perfil</Dropdown.Item>
          <Dropdown.Item id="saved">Guardados</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};

export default UserProfile;
