import usersGroup from '../../resources/images/medias/usersGroup.svg'
import usersRoles from '../../resources/images/medias/usersRoles.svg'
import TabLayout from '../../common/layouts/tabLayout/TabLayout.jsx'
import {useRestriction} from '../../common/util/permissions.js'
import {useMetaTags} from '../../common/util/useMetaTags.js'
import styles from './UsersPage.module.css'
import {useSelector} from 'react-redux'
import {useCallback} from 'react'


const UsersPage = () => {
  const permissions = useSelector((state) => state.session.permissions)
  const readonly = useRestriction('readonly')
  const [meta, setMeta] = useMetaTags({title: 'راد: مدیریت کاربران', description: 'settings'})

  const usersTabs = useCallback(() => {
    return {
      header: 'مدیریت کاربران',
      items: [
        {
          title: 'لیست کاربران',
          icon: usersGroup,
          link: 'users',
          hide: !permissions.includes('User-read'),
        },
        {
          title: 'لیست نقش‌ها',
          icon: usersRoles,
          link: 'roles',
          hide: !permissions.includes('Role-read'),
        },
      ],
    }
  },[permissions])

  return (
    <div className={styles.usersPage}>
      <TabLayout tabs={usersTabs()} />
    </div>
  )
}

export default UsersPage
