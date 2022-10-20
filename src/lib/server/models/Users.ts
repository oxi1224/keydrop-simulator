import { nanoid } from 'nanoid';
import { DataTypes, Model, Sequelize } from 'sequelize';
import type { Item } from '$lib';

export class Users extends Model {
  /**
   * Unique ID of an account
   */
  public declare id: string;

  /**
   * Username of an account
   */
  public declare username: string;

  /**
   * Hash of user's account password
   */
  public declare passwordHash: string;

  /**
   * Array of items in a user's inventory
   */
  public declare inventory: Item[];

  /**
   * How much money a user has on their account
   */
  public declare balance: number;

  /**
   * How much gold a user has on their account
   */
  public declare goldBalance: number;

  /**
   * Whether or not a user is in sandbox mode
   */
  public declare sandboxMode: boolean;

  public static initialize(sequelize: Sequelize) {
    Users.init(
      {
        id: { type: DataTypes.STRING, primaryKey: true, defaultValue: nanoid() },
        username: { type: DataTypes.STRING, allowNull: false },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        inventory: { type: DataTypes.ARRAY(DataTypes.JSONB), defaultValue: [] },
        balance: { type: DataTypes.NUMBER, defaultValue: 50 },
        goldBalance: { type: DataTypes.NUMBER, defaultValue: 0 },
        sandboxMode: { type: DataTypes.BOOLEAN, defaultValue: false }
      },
      { sequelize }
    );
  }
}