import { ILocation } from "@spt/models/eft/common/ILocation";
import _config from "../../config/config.json";
import mapConfig from "../../config/mapConfig.json";
import { bossesToRemoveFromPool, defaultHostility } from "./constants";
import { buildPmcWaves, MapSettings, shuffle } from "./utils";

export default function buildPmcs(
  config: typeof _config,
  locationList: ILocation[]
) {
  for (let index = 0; index < locationList.length; index++) {
    const mapSettingsList = Object.keys(mapConfig) as Array<
      keyof typeof mapConfig
    >;
    const map = mapSettingsList[index];

    locationList[index].base.BotLocationModifier.AdditionalHostilitySettings =
      defaultHostility;

    const { pmcHotZones = [] } = (mapConfig?.[map] as MapSettings) || {};

    // const pmcZones = [
    //   ...new Set(
    //     [...locationList[index].base.SpawnPointParams]
    //       .filter(
    //         ({ Categories, BotZoneName }) =>
    //           !!BotZoneName && Categories.includes("Player")
    //       )
    //       .map(({ BotZoneName }) => BotZoneName)
    //   ),
    // ];

    const pmcZones = shuffle<string[]>([
      ...new Set(
        [...locationList[index].base.BossLocationSpawn]
          .filter(
            ({ BossName }) =>
              BossName && ["pmcBEAR", "pmcUSEC"].includes(BossName)
          )
          .map(({ BossZone }) => BossZone)
      ),
      ...pmcHotZones,
    ]);

    const timeLimit = locationList[index].base.EscapeTimeLimit * 60;
    const { pmcWaveCount } = mapConfig[map];

    const waves = buildPmcWaves(timeLimit, pmcWaveCount, config, pmcZones);

    //Remove all other spawns from pool now that we have the spawns zone list
    locationList[index].base.BossLocationSpawn = locationList[
      index
    ].base.BossLocationSpawn.filter(
      (boss) => !bossesToRemoveFromPool.has(boss.BossName)
    );

    // apply our new waves
    locationList[index].base.BossLocationSpawn = [
      ...waves,
      ...locationList[index].base.BossLocationSpawn,
    ];
  }
}
