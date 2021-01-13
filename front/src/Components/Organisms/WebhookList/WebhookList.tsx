import _ from 'lodash';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addWebhook, deleteWebhook, getWebhooks, IWebhook } from '../../../Services/Redux/ducks/webhooks.ducks';
import { TimerDiceFormError } from '../../../Types/errors.types';
import Loader from '../../Atoms/Loader';
import WebhookForm from '../../Molecules/WebhookForm/WebhookForm';
import './WebhookList.scss';

interface WebhookListProps {
  /* eslint-disable-next-line react/require-default-props */
  className?: string;
}

export default function WebhookList({ className }: WebhookListProps) {
  const dispatch = useDispatch();
  const list: IWebhook[] = useSelector<IWebhook[]>((state: any) => _.get(state, 'webhooks.list.data', []));
  const error: string = useSelector<string>((state: any) => _.get(state, 'webhooks.list.error.response.data'));
  const isLoadingList: Boolean = useSelector<Boolean>((state: any) => _.get(state, 'webhooks.list.isLoading'));
  const isLoadingAdd: Boolean = useSelector<Boolean>((state: any) => _.get(state, 'webhooks.add.isLoading'));
  const addError: TimerDiceFormError = useSelector<TimerDiceFormError>((state: any) =>
    _.get(state, 'webhooks.add.error.response.data'),
  );

  function onDelete(id: string) {
    dispatch(deleteWebhook(id));
  }

  function onSubmit(webhook: any) {
    dispatch(addWebhook(webhook.uri));
  }

  useEffect(() => {
    dispatch(getWebhooks());
  }, [dispatch]);

  return (
    <div className={`WebhookList ${className || ''}`}>
      {isLoadingList && (
        <div className="WebhookList__loader l-bottom">
          <Loader size="20px" />
        </div>
      )}
      {error && <div>{error}</div>}
      {Array.isArray(list) &&
        !error &&
        list.map((element, index) => (
          <>
            <div className="WebhookList__element" key={element.id}>
              <div className="WebhookList__element__url">{element.url}</div>
              <div className="WebhookList__element__delete clickable" onClick={() => onDelete(element.id)} />
            </div>
            {index === list.length - 1 && (
              <WebhookForm
                onSubmit={onSubmit}
                isLoading={isLoadingAdd}
                error={addError}
                className="WebhookList__webhookform"
              />
            )}
          </>
        ))}
      {!error && !list.length && (
        <WebhookForm
          onSubmit={onSubmit}
          isLoading={isLoadingAdd}
          error={addError}
          className="WebhookList__webhookform"
        />
      )}
    </div>
  );
}
