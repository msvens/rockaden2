import * as migration_20260216_100515 from './20260216_100515';

export const migrations = [
  {
    up: migration_20260216_100515.up,
    down: migration_20260216_100515.down,
    name: '20260216_100515'
  },
];
