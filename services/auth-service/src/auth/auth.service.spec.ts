import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: '$2b$12$test-hash',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    emailVerified: false,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    fullName: 'Test User',
    comparePassword: jest.fn(),
    isActive: jest.fn(),
    isAdmin: jest.fn(),
    isReviewer: jest.fn(),
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    updateLastLogin: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'validPassword';
      
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(true);

      const result = await service.validateUser(email, password);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockUser.id);
      expect(result.email).toBe(mockUser.email);
      expect(result.password).toBeUndefined(); // Password should be excluded
    });

    it('should return null when user not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password';

      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'invalidPassword';

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(false);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user data on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'validPassword',
      };

      const mockToken = 'mock-jwt-token';
      const mockPayload = { sub: mockUser.id, email: mockUser.email, role: mockUser.role };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(true);
      mockUser.isActive.mockReturnValue(true);
      mockJwtService.sign.mockReturnValue(mockToken);
      mockUsersService.updateLastLogin.mockResolvedValue(undefined);

      const result = await service.login(loginDto);

      expect(result.access_token).toBe(mockToken);
      expect(result.user.id).toBe(mockUser.id);
      expect(result.user.email).toBe(mockUser.email);
      expect(mockJwtService.sign).toHaveBeenCalledWith(mockPayload);
      expect(mockUsersService.updateLastLogin).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'invalidPassword',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'validPassword',
      };

      const inactiveUser = { ...mockUser, status: UserStatus.SUSPENDED };

      mockUsersService.findByEmail.mockResolvedValue(inactiveUser);
      inactiveUser.comparePassword.mockResolvedValue(true);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create user and return access token on successful registration', async () => {
      const registerDto: RegisterDto = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        password: 'SecurePassword123!',
        passwordConfirmation: 'SecurePassword123!',
        role: UserRole.USER,
      };

      const mockToken = 'mock-jwt-token';
      const mockPayload = { sub: mockUser.id, email: mockUser.email, role: mockUser.role };

      mockUsersService.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.register(registerDto);

      expect(result.access_token).toBe(mockToken);
      expect(result.user.id).toBe(mockUser.id);
      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        password: registerDto.password,
        role: registerDto.role,
      });
    });

    it('should throw BadRequestException when passwords do not match', async () => {
      const registerDto: RegisterDto = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        password: 'SecurePassword123!',
        passwordConfirmation: 'DifferentPassword123!',
        role: UserRole.USER,
      };

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('refreshToken', () => {
    it('should return new access token for valid user', async () => {
      const userId = 'test-user-id';
      const mockToken = 'new-mock-jwt-token';
      const mockPayload = { sub: mockUser.id, email: mockUser.email, role: mockUser.role };

      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockUser.isActive.mockReturnValue(true);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.refreshToken(userId);

      expect(result.access_token).toBe(mockToken);
      expect(mockJwtService.sign).toHaveBeenCalledWith(mockPayload);
    });

    it('should throw UnauthorizedException for invalid user', async () => {
      const userId = 'invalid-user-id';

      mockUsersService.findOne.mockResolvedValue(null);

      await expect(service.refreshToken(userId)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      const userId = 'test-user-id';
      const inactiveUser = { ...mockUser, status: UserStatus.SUSPENDED };

      mockUsersService.findOne.mockResolvedValue(inactiveUser);

      await expect(service.refreshToken(userId)).rejects.toThrow(UnauthorizedException);
    });
  });
});
