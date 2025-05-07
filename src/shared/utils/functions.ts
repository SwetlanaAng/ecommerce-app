export function getAge(date: string): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dob = new Date(+date.split('-')[0], +date.split('-')[1], +date.split('-')[2]);
  const dobThisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
  let age: number = 0;
  age = today.getFullYear() - dob.getFullYear();
  if (today < dobThisYear) {
    age = age - 1;
  }
  return age;
}
