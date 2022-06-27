import React from 'react';
/**
 * @memberof LoggedUser
 * @alias LoggedUserProps
 * @private
 */
export declare type LoggedUserProps = {
    email: string;
    title?: string;
    avatarUrl?: string;
};
/**
 * @classdesc
 *
 * <img src="components/logged-user.png" />
 *
 * Logged in user state in the header
 *
 *
 * ### Usage
 *
 * ```javascript
 * import { LoggedUser, LoggedUserProps } from '@adminjs/design-system'
 * ```
 *
 * @component
 * @subcategory Molecules
 * @hideconstructor
 * @see {@link https://storybook.adminjs.co/?path=/story/designsystem-molecules-loggeduser--default Storybook}
 * @see LoggedUserProps
 * @section design-system
 * @deprecated In favour of {@link CurrentUserNav} component
 */
declare const LoggedUser: React.FC<LoggedUserProps>;
export { LoggedUser };
export default LoggedUser;
