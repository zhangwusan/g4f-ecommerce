import { UserDecoratorType } from "@/app/common/decorators/user.decorator";
import { ApiResponse } from "@/app/common/interfaces/api.interface";
import { ProfileResponse } from "@/app/common/interfaces/profile.interface";
import { RoleEnum } from "@/app/common/utils/enum/role.enum";
import User from "@/app/models/user/user.model";
import sequelizeConfig from "@/config/sequelize.config";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize";
import { ChangeInfomationRequest, ChangePasswordRequest } from "./dto";


@Injectable()
export class ProfileService {

  async setup(user: UserDecoratorType) {
    const menuItems = [];

    if (user.role_id === RoleEnum.ADMIN) {
      menuItems.push({ label: 'Dashboard', href: '/admin/dashboard' });
    }

    menuItems.push(
      { label: 'Profile', href: '/auth/profile' },
      { label: 'Settings', href: '/auth/profile/settings' },
      { label: 'Payments', href: '/auth/profile/payments' },
      { label: 'Logout' }
    );

    return {
      message: 'Fetching is successfully',
      data: menuItems
    };
  }

  async view(user_dec: UserDecoratorType): Promise<ApiResponse<ProfileResponse>> {
    try {
      const user = await User.findOne({
        where: {
          id: user_dec.id,
        },
        attributes: ['first_name', 'last_name', 'username', 'email', 'phone_number', 'address', 'avatar', 'bio']
      });

      return {
        message: 'Fetching data successfully.',
        data: user
      }
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error.message)
    }
  }

  async upload_avatar(image_url: string, user_dec: UserDecoratorType) {
    const sequelize = new Sequelize(sequelizeConfig);
    const transaction = await sequelize.transaction();
    try {
      const user = await User.findOne({
        where: { id: user_dec.id },
        transaction,
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      user.avatar = image_url;
      await user.save({ transaction });

      await transaction.commit();
      return { message: 'Avatar updated successfully', avatar: image_url };
    } catch (error) {
      await transaction.rollback();
      console.error('Upload avatar error:', error);
      throw new BadRequestException(error.message);
    } finally {
      await sequelize.close();
    }
  }

  async change_password(body: ChangePasswordRequest, user_dec: UserDecoratorType) {
    const sequelize = new Sequelize(sequelizeConfig);
    const transaction = await sequelize.transaction();
    try {
      // Find the user
      const user = await User.findOne({
        where: { id: user_dec.id }
      });

      if (!user) {
        throw new BadRequestException('User not found.');
      }

      // Compare old password
      if (!(await user.comparePassword(body.oldPassword))) {
        throw new BadRequestException('Old password is incorrect');
      }
      
      if (body.oldPassword === body.newPassword) {
        throw new BadRequestException('New password must be different from the old password');
      }

      // Check if the new password and confirm password match
      if (body.newPassword !== body.confirmPassword) {
        throw new BadRequestException('New password and confirm password do not match');
      }

      // Update user's password
      user.password = body.newPassword;

      // Save the user
      await user.save({ transaction });

      // Commit the transaction
      await transaction.commit();

      return { message: 'Password changed successfully' };

    } catch (error) {
      await transaction.rollback();
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  async change_information(body: ChangeInfomationRequest, user_dec: UserDecoratorType) {
    const sequelize = new Sequelize(sequelizeConfig);
    const transaction = await sequelize.transaction();
    try {
      const user = await User.findOne({
        where: {
          id: user_dec.id
        }
      })

      if(!user) {
        throw new BadRequestException('User not found');
      }
      await user.update({
        first_name: body.first_name,
        last_name: body.last_name,
        username: body.username,
        phone_number: body.phone,
        address: body.address,
        bio: body.bio
      })

      await transaction.commit()

      // fetch data for response
      const user_response = await User.findOne({
        where: {
          id: user_dec.id,
        },
        attributes: ['first_name', 'last_name', 'username', 'email', 'phone_number', 'address', 'avatar', 'bio']
      });

      return {
        message: 'Updated is successfully',
        data: user_response
      }
      
    } catch (error) {
      console.log(error);
      await transaction.rollback()
      throw new BadRequestException(error.message)
    }
  }
}