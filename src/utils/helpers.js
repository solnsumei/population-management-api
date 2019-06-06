export const columns = ['name', 'population'];

export const formattedLocation = location => ({
  _id: location._id,
  name: location.name,
  parent: location.parent,
  population: location.population,
  children: location.children,
});

export const aggregateLocation = (location) => {
  if (location.children.length > 0) {
    let total = 0;
    let male = 0;
    let female = 0;

    location.children.map((child) => {
      total += child.population.total;
      male += child.population.male;
      female += child.population.female;
    });

    location.population.total += total;
    location.population.male += male;
    location.population.female += female;
  }
};
