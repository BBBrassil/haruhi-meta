((Episodes) => {
  const { Arrays, Dates } = Haruhi;

  Episodes.fetch = async () => {
    return fetch("/episodes.json").then((result) => result.json());
  };

  Episodes.schedule = (year) => {
    let result = {};
    const rng = new Math.seedrandom(year);
    let d;

    const melancholy = [];
    // First business day after May 5
    d = Dates.getBusinessDayAfter(new Date(year, 4, 5));
    melancholy.push(d);
    // Next Tuesday
    d = Dates.getWeekdayAfter(d, 2);
    melancholy.push(d);
    // Next Friday
    d = Dates.getWeekdayAfter(d, 5);
    melancholy.push(d);
    // Next Tuesday
    d = Dates.getWeekdayAfter(d, 2);
    melancholy.push(d);
    // Next 2 days
    d = Dates.addDays(d, 1);
    melancholy.push(d);
    d = Dates.addDays(d, 1);
    melancholy.push(d);

    const boredom = Dates.getWeekdayInMonth(year, 5, 0, 2); // 2nd Sunday in June

    const bambooLeafRhapsody = new Date(year, 6, 7); // July 7th

    const mysteriqueSign = Dates.getWeekdayInMonth(year, 6, 4, 2); // 2nd Thursday in July

    const remoteIslandSyndrome = [];
    // 3rd Saturday in July
    d = Dates.getWeekdayInMonth(year, 6, 6, 3);
    remoteIslandSyndrome.push(d);
    // Next day
    d = Dates.addDays(d, 1);
    remoteIslandSyndrome.push(d);

    const endlessEightParts = [1]
      .concat(Arrays.roundRobinNoRepeats([2, 3, 4, 5, 6, 7], 5, rng).slice(0, 29))
      .concat(8);
    const endlessEight = endlessEightParts.map((_, i) => new Date(year, 7, i + 1));

    const cultureDay = new Date(year, 10, 3);

    // Saturday nearest Culture Day
    const liveAlive = cultureDay.getDay() < 3
      ? Dates.getWeekdayBefore(cultureDay, 6)
      : Dates.getWeekdayAfter(Dates.addDays(cultureDay, -1), 6);

    // Previous Saturday
    const sigh3 = Dates.getWeekdayBefore(liveAlive, 6);

    const sigh = [
      Dates.addDays(sigh3, -2),
      Dates.addDays(sigh3, -1),
      sigh3,
      Dates.addDays(sigh3, 1),
      Dates.addDays(sigh3, 2),
    ];

    const dayOfSagittarius = Dates.getWeekdayAfter(liveAlive, 3); // Next Wednesday

    const somedayInTheRain = Dates.getWeekdayBefore(new Date(year, 11, 1), 5); // Last Friday in November

    const disappearance = new Date(year, 11, 18); // December 18

    melancholy.forEach((x, i) => (result[Dates.iso(x)] = "melancholy" + (i + 1)));
    result[Dates.iso(boredom)] = "boredom";
    result[Dates.iso(bambooLeafRhapsody)] = "bambooLeafRhapsody";
    result[Dates.iso(mysteriqueSign)] = "mysteriqueSign";
    remoteIslandSyndrome.forEach((x, i) => (result[Dates.iso(x)] = "remoteIslandSyndrome" + (i + 1)));
    endlessEight.forEach((x, i) => (result[Dates.iso(x)] = "endlessEight" + endlessEightParts[i]));
    sigh.forEach((x, i) => (result[Dates.iso(x)] = "sigh" + (i + 1)));
    result[Dates.iso(liveAlive)] = ["episode00", "liveAlive"];
    result[Dates.iso(dayOfSagittarius)] = "dayOfSagittarius";
    result[Dates.iso(somedayInTheRain)] = "somedayInTheRain";
    result[Dates.iso(disappearance)] = "disappearance";

    return result;
  };

  Episodes.monthlySchedule = (year) => {
    const schedule = Episodes.schedule(year);
    const isos = Object.keys(schedule);
    const dates = isos.map(x => Dates.parseISODateInLocalTime(x));
    return dates.reduce(
      (a, date, i) => {
        const item = { date, iso: isos[i] };
        const month = date.getMonth();
        if (a.previousGroup && month === a.previousMonth) {
          a.previousGroup.push(item);
        }
        else {
          for (let i = 0; i < month - a.previousMonth - 1; ++i) {
            a.groups.push([]);
          }
          a.previousMonth = month;
          a.groups.push(a.previousGroup = [item]);
        }
        return a;
      }, { groups: [], previousMonth: -1 }
    ).groups.map(group => Object.fromEntries(group.map((x) => {
      const { iso } = x;
      return [iso, schedule[iso]];
    })));
  };
})(Haruhi.Episodes = Haruhi.Episodes || {});