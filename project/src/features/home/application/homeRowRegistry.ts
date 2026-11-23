import { Registry } from '@/core/registry/Registry';

import type { HomeRow } from '../domain/HomeRow';
import { BecauseYouWatchedRow } from './rows/BecauseYouWatchedRow';
import { ContinueWatchingRow } from './rows/ContinueWatchingRow';
import { KidsRow } from './rows/KidsRow';
import { MyListRow } from './rows/MyListRow';
import { NewReleasesRow } from './rows/NewReleasesRow';
import { PopularRow } from './rows/PopularRow';
import { Top10Row } from './rows/Top10Row';
import { TopRatedRow } from './rows/TopRatedRow';
import { TrendingRow } from './rows/TrendingRow';


export function createHomeRowRegistry(): Registry<HomeRow> {
  return new Registry<HomeRow>().registerAll([
    new ContinueWatchingRow(),
    new MyListRow(),
    new TrendingRow(),
    new Top10Row(),
    new BecauseYouWatchedRow(),
    new PopularRow(),
    new NewReleasesRow(),
    new TopRatedRow(),
    new KidsRow('movie'),
    new KidsRow('tv'),
  ]);
}