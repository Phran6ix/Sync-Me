import { Router } from "express";

export default interface controllerInterface {
  path: string;
  router: Router;
}
