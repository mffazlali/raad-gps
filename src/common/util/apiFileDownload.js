import axios from 'axios'
import axiosInstance from './axiosConfig'
import {getCurrentDateTime} from './DateTimeUtil.js'
import {formatTime} from './formatter.js'
import {usePreference} from './preferences.js'

const useApiFileDownload = () => {
  const hours12 = usePreference('twelveHourFormat')

  const apiFileDownloader=(name,url)=>{
    return axiosInstance.get(url, {
      responseType: 'blob'
    })
      .then(response => {
        const blob = new Blob([response.data]);
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        // const {date,time}=getCurrentDateTime()
        const dateTime=formatTime(Date.now(), 'seconds', hours12)
        // link.download =`${name}-${date} ${time}.xlsx`;
        link.download =`${name}-${dateTime}.xlsx`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(downloadUrl);
      })
      .catch(error => {
        console.error('There was a problem with the download operation:', error);
      });
  }

  return {apiFileDownloader}
}

export default useApiFileDownload
