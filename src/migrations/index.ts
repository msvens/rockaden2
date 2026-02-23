import * as migration_20260223_101731 from './20260223_101731';
import * as migration_20260223_131601 from './20260223_131601';
import * as migration_20260223_135641 from './20260223_135641';

export const migrations = [
  {
    up: migration_20260223_101731.up,
    down: migration_20260223_101731.down,
    name: '20260223_101731',
  },
  {
    up: migration_20260223_131601.up,
    down: migration_20260223_131601.down,
    name: '20260223_131601',
  },
  {
    up: migration_20260223_135641.up,
    down: migration_20260223_135641.down,
    name: '20260223_135641'
  },
];
