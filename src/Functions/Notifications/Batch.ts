import api from '~/Services/API';

interface sendBatchNotification {
    batch_id: string;
}

export async function sendBatchNotification({
    batch_id,
}: sendBatchNotification): Promise<void> {
    await api.post(`/batches/notifications/${batch_id}`);
}
