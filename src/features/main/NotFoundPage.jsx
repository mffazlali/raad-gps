import LogoImage from '../../features/auth/logoImage/LogoImage.jsx'

const NotFoundPage = () => {

  return (
    <div>
      <div className={'bg-theme-light flex justify-center py-3'}><span className={'text-gray-900 font-bold leading-5 text-medium'}>صفحه مورد نظر یافت نشد</span></div>
      <div className={'fixed w-screen h-[100dvh] top-0 right-0 flex justify-center items-center'}>
        <LogoImage/>
      </div>
    </div>)
}
export default NotFoundPage
