export enum UserRole {
  ADMIN = 1,
  STAFF = 2,
  CUSTOMER = 3,
}

export const ROLE_ROUTES = {
  [UserRole.ADMIN]: "/Admin",
  [UserRole.STAFF]: "/staff",
  [UserRole.CUSTOMER]: "/Show",
};

export const ROLE_NAMES = {
  [UserRole.ADMIN]: "Admin",
  [UserRole.STAFF]: "Nhân viên",
  [UserRole.CUSTOMER]: "Khách hàng",
};

export const getHomeRouteForRole = (roleId: number): string => {
  return ROLE_ROUTES[roleId as UserRole] || "/customer";
};

export const getRoleName = (roleId: number): string => {
  return ROLE_NAMES[roleId as UserRole] || "Khách hàng";
};
