import {
  IBossLocationSpawn,
  IWave,
} from "@spt/models/eft/common/ILocationBase";

export const waveBuilder = (
  totalWaves: number,
  timeLimit: number,
  waveDistribution: number,
  wildSpawnType: string,
  difficulty: number,
  isPlayer: boolean,
  maxSlots: number,
  combinedZones: string[] = [],
  specialZones: string[] = [],
  offset?: number,
  starting?: boolean,
  moreGroups?: boolean
): IWave[] => {
  const averageTime = timeLimit / totalWaves;
  const firstHalf = Math.round(averageTime * (1 - waveDistribution));
  const secondHalf = Math.round(averageTime * (1 + waveDistribution));
  let timeStart = offset || 0;
  const waves = [];
  let maxSlotsReached = Math.round(1.3 * totalWaves);
  while (
    totalWaves > 0 &&
    (waves.length < totalWaves || specialZones.length > 0)
  ) {
    const accelerate = totalWaves > 5 && waves.length < totalWaves / 3;
    const stage = Math.round(
      waves.length < Math.round(totalWaves * 0.5)
        ? accelerate
          ? firstHalf / 3
          : firstHalf
        : secondHalf
    );

    const min = !offset && waves.length < 1 ? 0 : timeStart;
    const max = !offset && waves.length < 1 ? 0 : timeStart + 10;

    if (waves.length >= 1 || offset) timeStart = timeStart + stage;
    const BotPreset = getDifficulty(difficulty);
    // console.log(wildSpawnType, BotPreset);
    // Math.round((1 - waves.length / totalWaves) * maxSlots) || 1;
    const slotMax =
      Math.round(
        (moreGroups ? Math.random() : Math.random() * Math.random()) * maxSlots
      ) || 1;

    waves.push({
      BotPreset,
      BotSide: "Savage",
      SpawnPoints: getZone(
        specialZones,
        combinedZones,
        waves.length >= totalWaves
      ),
      isPlayers: isPlayer,
      slots_max: slotMax,
      slots_min: 0,
      time_min: starting ? -1 : min,
      time_max: starting ? -1 : max,
      WildSpawnType: wildSpawnType,
      number: waves.length,
    });
    maxSlotsReached -= slotMax;
    // if (wildSpawnType === "assault") console.log(slotMax, maxSlotsReached);
    if (maxSlotsReached <= 0) break;
  }

  return waves;
};

const getZone = (specialZones, combinedZones, specialOnly) => {
  if (!specialOnly && combinedZones.length)
    return combinedZones[
      Math.round((combinedZones.length - 1) * Math.random())
    ];
  if (specialZones.length) return specialZones.pop();
  return "";
};

export const getDifficulty = (diff: number) => {
  const randomNumb = Math.random() + diff;
  switch (true) {
    case randomNumb < 0.55:
      return "easy";
    case randomNumb < 1.4:
      return "normal";
    case randomNumb < 1.85:
      return "hard";
    default:
      return "impossible";
  }
};

export const shuffle = <n>(array: any): n => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const buildBossBasedWave = (
  BossChance: number,
  BossEscortAmount: string,
  BossEscortType: string,
  BossName: string,
  BossZone: string,
  raidTime?: number
): IBossLocationSpawn => {
  return {
    BossChance,
    BossDifficult: "normal",
    BossEscortAmount,
    BossEscortDifficult: "normal",
    BossEscortType,
    BossName,
    BossPlayer: false,
    BossZone,
    Delay: 0,
    ForceSpawn: false,
    IgnoreMaxBots: true,
    RandomTimeSpawn: false,
    Time: raidTime ? Math.round(Math.random() * (raidTime * 5)) : -1,
    Supports: null,
    TriggerId: "",
    TriggerName: "",
    spawnMode: ["regular", "pve"],
  };
};

const zombieTypes = [
  "infectedAssault",
  // "infectedTagilla",
  "infectedLaborant",
  "infectedCivil",
];

export const getRandomDifficulty = (num: number = 1.5) =>
  getDifficulty(Math.round(Math.random() * num * 10) / 10);

export const getRandomZombieType = () =>
  zombieTypes[Math.round((zombieTypes.length - 1) * Math.random())];

export const buildZombie = (
  totalWaves: number,
  escapeTimeLimit: number,
  waveDistribution: number,
  BossChance: number = 100
): IBossLocationSpawn[] => {
  const averageTime = (escapeTimeLimit * 60) / totalWaves;
  const firstHalf = Math.round(averageTime * (1 - waveDistribution));
  const secondHalf = Math.round(averageTime * (1 + waveDistribution));
  let timeStart = 0;
  const waves: IBossLocationSpawn[] = [];
  let maxSlotsReached = Math.round(1.3 * totalWaves);

  while (totalWaves > 0) {
    const accelerate = totalWaves > 5 && waves.length < totalWaves / 3;
    const stage = Math.round(
      waves.length < Math.round(totalWaves * 0.5)
        ? accelerate
          ? firstHalf / 3
          : firstHalf
        : secondHalf
    );

    if (waves.length >= 1) timeStart = timeStart + stage;
    const main = getRandomZombieType();
    waves.push({
      BossChance,
      BossDifficult: "normal",
      BossEscortAmount: "0",
      BossEscortDifficult: "normal",
      BossEscortType: main,
      BossName: main,
      BossPlayer: false,
      BossZone: "",
      Delay: 0,
      IgnoreMaxBots: true,
      RandomTimeSpawn: false,
      Time: timeStart,
      Supports: new Array(
        Math.round(Math.random() * Math.random() * 4) /* <= 4 AddthistoConfig */
      )
        .fill("")
        .map(() => ({
          BossEscortType: getRandomZombieType(),
          BossEscortDifficult: ["normal"],
          BossEscortAmount: "1",
        })),
      TriggerId: "",
      TriggerName: "",
      spawnMode: ["regular", "pve"],
    });

    maxSlotsReached -= 1 + waves[waves.length - 1].Supports.length;
    if (maxSlotsReached <= 0) break;
  }

  return waves;
};

export interface MapSettings {
  EscapeTimeLimit?: number;
  maxBotPerZoneOverride?: number;
  pmcHotZones?: string[];
  scavHotZones?: string[];
  pmcWaveCount: number;
  scavWaveCount: number;
  zombieWaveCount: number;
}
