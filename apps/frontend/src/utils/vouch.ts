import { isVouched } from 'vouchdao'

export async function checkVouch(walletAddress: string): Promise<boolean> {
    const vouched = await isVouched(walletAddress)
    return vouched
}