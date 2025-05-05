import { DuckType, DuckTypeConfig } from './DuckType';
import { Duck } from './Duck';

export const DUCK_CONFIGS: Record<DuckType, DuckTypeConfig> = {
  white: {
    idPrefix: 'white',
    className: 'duck',
    imagePath: '../../assets/duck/right-left/a',
    storageKey: 'duckCount'
  },
  red: {
    idPrefix: 'red',
    className: 'redduck',
    imagePath: '../../assets/duck/right-left-red/a',
    storageKey: 'redDuckCount'
  },
  yellow: {
    idPrefix: 'yellow ',
    className: 'yellowduck',
    imagePath: '../../assets/duck/right-left-yellow/a',
    storageKey: 'yellowDuckCount'
  }
};

export const ducks: Record<DuckType, Duck[]> = {
  white: [],
  red: [],
  yellow: []
};
