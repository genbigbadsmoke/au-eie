import React from 'react';
import { ThemeProps, DefaultTheme } from 'styled-components';
/**
 * @memberof Illustration
 * @alias IllustrationProps
 */
export declare type IllustrationProps = {
    /**
     * Available illustration variant
     */
    variant: 'Moon' | 'Rocket' | 'Astronaut' | 'DocumentCheck' | 'DocumentSearch' | 'FileSearch' | 'FlagInCog' | 'Folders' | 'Launch' | 'Planet' | 'AdminJSLogo' | 'SoftwareBrothersLogo' | 'GithubLogo' | 'SlackLogo';
    /** Optional max width restrictions */
    width?: number;
    /** Optional max height restrictions */
    height?: number;
};
declare type RawIllustrationType = IllustrationProps & ThemeProps<DefaultTheme> & {
    children?: React.ReactNode;
};
/**
 * @classdesc
 *
 * <img src="components/illustration.png" />
 *
 * Awesome database with all the illustrations provided with AdminJS.
 *
 * The best thing about them is that they follow your {@link Theme} color palette.
 *
 * ### Usage
 *
 * ```javascript
 * import { Illustration, IllustrationProps } from '@adminjs/design-system'
 * ```
 *
 * @component
 * @subcategory Atoms
 * @see IllustrationProps
 * @see {@link https://storybook.adminjs.co/?path=/story/designsystem-atoms-illustration--default Storybook}
 * @hideconstructor
 *
 * @example <caption>Folders</caption>
 * return (
 *   <Illustration variant="Folders" />
 * )
 * @example <caption>DocumentSearch</caption>
 * return (
 *   <Illustration variant="DocumentSearch" />
 * )
 * @example <caption>Rocket</caption>
 * return (
 *   <Box bg="grey100" p="xxl"><Illustration variant="Rocket" /></Box>
 * )
 * @section design-system
 */
declare const Illustration: React.ForwardRefExoticComponent<Pick<React.PropsWithChildren<RawIllustrationType>, "height" | "width" | "children" | "variant"> & {
    theme?: DefaultTheme | undefined;
}>;
export { Illustration };
export default Illustration;
