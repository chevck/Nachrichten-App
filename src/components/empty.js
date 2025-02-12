import MegaPhone from "../assets/imgs/megaphone.png";

export function EmptyState({ text = "No results found" }) {
  return (
    <div className='empty-state'>
      <img src={MegaPhone} alt='megaphone' className='img-fluid' />
      <p>{text}</p>
    </div>
  );
}
