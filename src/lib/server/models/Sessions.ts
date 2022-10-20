import { nanoid } from 'nanoid';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class Sessions extends Model {
  /**
   * Unique session ID
   */
  public declare id: string;

  /**
   * ID of the account the session belongs to
   */
  public declare userId: string;

  public static initialize(sequelize: Sequelize) {
    Sessions.init(
      {
        id: { type: DataTypes.STRING, primaryKey: true, defaultValue: nanoid() },
        userId: { type: DataTypes.STRING, allowNull: false },
      },
      { sequelize }
    );
  }
}