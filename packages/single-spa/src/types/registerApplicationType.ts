export type RegisterApplicationType = (
  appName: string,
  loadApp: () => Promise<any>,
  activeWhen: (location: string) => boolean,
  customProps?: any,
  bootstrap?: (
    customProps: any 
  ) => Promise<any>,
  mount?: (props: any) => Promise<any>,
  unmount?: (props: any) => Promise<any>
) => void;

export type RegisterationType = {
  name: string;
  loadApp: (
    customProps: any
  ) => Promise<any>;
  activeWhen: (location: string) => boolean;
  customProps?: any;
  status: string;
  bootstrap?: (
    customProps: any
  ) => Promise<any>;
  mount?: (props: any) => Promise<any>;
  unmount?: (props: any) => Promise<any>;
}