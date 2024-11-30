import { classNames } from '@/Providers/helpers';
import NoRecords from '@/Components/NoRecords';
import ListActions from '@/Components/ListActions';

function ListDetails({
  offices,
  isOfficeSelected,
  onClicked,
  setOfficeDeleteDialogOpen,
}) {
  return offices.length > 0 ? (
    <div className="space-y-2.5">
      {offices.map((office, i) => (
        <div
          key={i}
          onClick={() => onClicked(office, i)}
          className={classNames(
            isOfficeSelected(office)
              ? 'bg-latisSecondary-500 font-semibold text-black'
              : 'font-normal text-latisGray-900 hover:bg-white',
            ' flex w-full items-center justify-between space-x-2 rounded-md px-3.5 py-5 text-base'
          )}
        >
          <div className="flex w-full">{office.name}</div>
          <ListActions
            title={'More Links'}
            moreLinks={[
              {
                type: 'Delete Office',
                action: function () {
                  setOfficeDeleteDialogOpen(true);
                },
              },
            ]}
          />
        </div>
      ))}
    </div>
  ) : (
    <NoRecords className="border-b border-mlmgray-400" />
  );
}

export default ListDetails;
