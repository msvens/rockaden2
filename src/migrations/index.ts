import * as migration_20260223_101731 from './20260223_101731';

export const migrations = [
  {
    up: migration_20260223_101731.up,
    down: migration_20260223_101731.down,
    name: '20260223_101731'
  },
];
