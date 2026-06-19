interface tagProps {
  name: string;
}
export const Tag = ({ name }: tagProps) => {
  return <p className="border"> {name}</p>;
};
