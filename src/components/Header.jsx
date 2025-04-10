import React from 'react';
import { Group, Title, Button, Box, Anchor } from '@mantine/core';
import { IconPlus, IconX, IconDeviceDesktop } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const Header = ({ title, onAdd, showAdd }) => {
  return (
    <Box px="md" py="md" bg="gray.0" mb="md" style={{ borderBottom: '1px solid #ddd' }}>
      <Group justify="space-between">
        <Group>
          <Title order={3}>{title}</Title>
          <Anchor component={Link} to="/machines" style={{ marginLeft: '1rem' }}>
            <Group spacing="xs">
              <IconDeviceDesktop size={16} />
              <span>Quản Lý Máy Móc</span>
            </Group>
          </Anchor>
        </Group>
        {onAdd && (
          <Button
            onClick={onAdd}
            color={showAdd ? 'red' : 'blue'}
            leftSection={showAdd ? <IconX size={16} /> : <IconPlus size={16} />}
          >
            {showAdd ? 'Đóng' : 'Thêm Mới'}
          </Button>
        )}
      </Group>
    </Box>
  );
};

export default Header; 